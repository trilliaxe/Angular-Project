export interface Photo {
  id: string;
  owner: string;
  secret: string;
  server: string;
  farm: number;
  title: string;
  ispublic: number;
  dateupload?: string;
  datetaken?: string;
  ownername?: string;
  url_s?: string;  // small
  url_m?: string;  // medium
  url_l?: string;  // large
  url_o?: string;  // original
  height_m?: number;
  width_m?: number;
  tags?: string;
  views?: string;
  description?: { _content: string };
  latitude?: string;
  longitude?: string;
}

export interface PhotoSearchResult {
  photos: {
    page: number;
    pages: number;
    perpage: number;
    total: string;
    photo: Photo[];
  };
  stat: string;
}

export interface PhotoInfo {
  id: string;
  owner: {
    nsid: string;
    username: string;
    realname: string;
    location: string;
    iconserver: string;
    iconfarm: number;
  };
  title: { _content: string };
  description: { _content: string };
  dates: {
    posted: string;
    taken: string;
  };
  tags: {
    tag: Array<{ _content: string }>;
  };
  location?: {
    latitude: string;
    longitude: string;
    country: { _content: string };
    region: { _content: string };
    locality: { _content: string };
  };
  urls: {
    url: Array<{ type: string; _content: string }>;
  };
}

export interface Comment {
  id: string;
  author: string;
  authorname: string;
  content: string;
  datecreate: string;
  _content: string;
}

export interface SearchFilters {
  text: string;
  size: string;   // s=petite, m=moyenne, l=grande (taille d'affichage)
  tags: string;
  sort: string;
  minUploadDate: string;
  maxUploadDate: string;
  contentType: string; // 1=photos, 2=screenshots, 3=other, 4=all
  safeSearch: string;  // 1=safe, 2=moderate, 3=restricted
  inGallery: boolean;
  extras: string;
}
