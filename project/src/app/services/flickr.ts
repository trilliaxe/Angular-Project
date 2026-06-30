import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Photo, PhotoSearchResult, PhotoInfo, Comment, SearchFilters } from '../models/photo.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlickrService {
  private readonly API_KEY = environment.flickr.key;
  private readonly BASE_URL = 'https://www.flickr.com/services/rest/';

  constructor(private http: HttpClient) {}


  /**
   * Construit les paramètres communs à tous les appels API
   * @param method La method a mettre
   * @returns Retourne les paramètres de la requete http
   */
  private baseParams(method: string): HttpParams {
    return new HttpParams()
      .set('method', method)
      .set('api_key', this.API_KEY)
      .set('format', 'json')
      .set('nojsoncallback', '1');
  }


  /**
   *  Recherche des photos selon les filtres donnés
   * @param filters  Le filtre a appliqué à la recherche
   * @param page le nombre de page à remplir
   * @param perPage le nombre de photo par page
   * @returns Renvoie PhotoSearchResult
   */
  searchPhotos(filters: SearchFilters, page: number = 1, perPage: number = 24): Observable<PhotoSearchResult> {
    let params = this.baseParams('flickr.photos.search')
      .set('text', filters.text)
      .set('sort', filters.sort || 'relevance')
      .set('safe_search', filters.safeSearch || '1')
      .set('content_type', filters.contentType || '1')
      .set('page', page.toString())
      .set('per_page', perPage.toString())
      .set('extras', 'url_s,url_m,url_l,date_upload,date_taken,owner_name,tags,views,description,geo');

    if (filters.tags) {
      params = params.set('tags', filters.tags);
    }
    if (filters.minUploadDate) {
      params = params.set('min_upload_date', new Date(filters.minUploadDate).getTime() / 1000 + '');
    }
    if (filters.maxUploadDate) {
      params = params.set('max_upload_date', new Date(filters.maxUploadDate).getTime() / 1000 + '');
    }
    if (filters.inGallery) {
      params = params.set('in_gallery', '1');
    }

    return this.http.get<PhotoSearchResult>(this.BASE_URL, { params });
  }

  /**
   * Récupère les informations détaillées d'une photo
   * @param photoId L'ID de la photo cible
   * @param secret  le secret pour la requete
   * @returns Renvoie les informations de la photo
   */
  getPhotoInfo(photoId: string, secret: string): Observable<{ photo: PhotoInfo; stat: string }> {
    const params = this.baseParams('flickr.photos.getInfo')
      .set('photo_id', photoId)
      .set('secret', secret);
    return this.http.get<{ photo: PhotoInfo; stat: string }>(this.BASE_URL, { params });
  }


  /**
   * Récupère les commentaires d'une photo
   * @param photoId l'ID de la photo cible
   * @returns Renvoie les commentaires de la photo cible
   */
  getPhotoComments(photoId: string): Observable<{ comments: { comment: Comment[] }; stat: string }> {
    const params = this.baseParams('flickr.photos.comments.getList')
      .set('photo_id', photoId);
    return this.http.get<any>(this.BASE_URL, { params });
  }

  /**
   *  Récupère les photos d'un auteur (owner)
   * @param userId l'ID de l'utilisateur
   * @param perPage le nombre de photo par page
   * @returns 
   */
  getPhotosByOwner(userId: string, perPage: number = 9): Observable<PhotoSearchResult> {
    const params = this.baseParams('flickr.photos.search')
      .set('user_id', userId)
      .set('per_page', perPage.toString())
      .set('extras', 'url_s,url_m,url_l,owner_name');
    return this.http.get<PhotoSearchResult>(this.BASE_URL, { params });
  }

  /**
   * Récupère toutes les données d'une photo avec plusieurs appels
   * @param photoId l'ID de la photo cible
   * @param secret le secret pour la requete
   * @param ownerId l'id du propiétaire de la photo
   * @returns Renvoies les infos, les commentaires et l'avatar de la photo
   */
  getPhotoDetails(photoId: string, secret: string, ownerId: string): Observable<{
    info: PhotoInfo;
    comments: Comment[];
    authorPhotos: Photo[];
  }> {
    return forkJoin({
      infoResp: this.getPhotoInfo(photoId, secret),
      commentsResp: this.getPhotoComments(photoId),
      authorPhotosResp: this.getPhotosByOwner(ownerId)
    }).pipe(
      map(({ infoResp, commentsResp, authorPhotosResp }) => ({
        info: infoResp.photo,
        comments: commentsResp.comments?.comment || [],
        authorPhotos: authorPhotosResp.photos?.photo || []
      }))
    );
  }

  /**
   * Construit l'URL d'une photo à partir de ses métadonnées
   * @param photo Toutes les informatiosn utilent pour recuperer la photo
   * @param size la taille demandé pour la photo
   * @returns Renvoie une string qui repressente l'url de la photo
   */
  buildPhotoUrl(photo: Photo, size: 's' | 'm' | 'l' | 'o' = 'm'): string {
    return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`;
  }

  /**
   * Construit l'URL de l'avatar d'un auteur
   * @param iconServer
   * @param iconFarm 
   * @param nsid 
   */
  buildAvatarUrl(iconServer: string, iconFarm: number, nsid: string): string {
    if (iconServer && parseInt(iconServer) > 0) {
      return `https://farm${iconFarm}.staticflickr.com/${iconServer}/buddyicons/${nsid}.jpg`;
    }
    return 'https://www.flickr.com/images/buddyicon.gif';
  }
}
