import { Genre } from './genre.model';

export class Movie {
    id: String;
    language: String;
    title: String;
    overview: String;
    release_date: String;
    popularity: number;
    vote_average: number;
    vote_count: number;
    poster_path: String;
    trailer_url: String;
    recommended: Movie[];
    imdb_rating: number;
    rotten_tomatoes: string;
    genres: Genre[];
    gomovies_id: string;
}
