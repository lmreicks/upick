import { Movie } from './movie.model';

export class Genre {
    id: number;
    name: String;
    movies?: Movie[];
}
