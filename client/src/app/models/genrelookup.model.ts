const genrelookupArray = [
  { id: 35, genre: 'Comedy' },
  { id: 28, genre: 'Action' },
  { id: 12, genre: 'Adventure' },
  { id: 80, genre: 'Crime' },
  { id: 99, genre: 'Documentary' },
  { id: 18, genre: 'Drama' },
  { id: 10751, genre: 'Family' },
  { id: 36, genre: 'History' },
  { id: 27, genre: 'Horror' },
  { id: 10402, genre: 'Music' },
  { id: 9648, genre: 'Mystery' },
  { id: 10749, genre: 'Romance' },
  { id: 10770, genre: 'TV Movie' },
  { id: 878, genre: 'Science Fiction' },
  { id: 53, genre: 'Thriller' },
  { id: 10752, genre: 'War' },
  { id: 37, genre: 'Western' },
];

export const genreLookup = new Map( // Look Ma!  No type annotations
  genrelookupArray.map(x => [x.id, x.genre] as [number, string])
);
