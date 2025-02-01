// // src/application/usecases/CreateMovieUseCase.ts

// import { VideoMetadataRepository } from "../infrastructure/repositories/VideoMetadataRepository";
// import { Movie } from "../domain/entities/MovieMetadata";

// export class CreateMovieUseCase {
//   private movieRepository: VideoMetadataRepository;

//   constructor(movieRepository: VideoMetadataRepository) {
//     this.movieRepository = movieRepository;
//   }

//   async execute(movieData: Movie): Promise<Movie | null> {
//     console.log("from usercase", movieData);
//     const existingMovie = await this.movieRepository.findById(movieData._id);


//     if (existingMovie) {
//       console.log("already exists")
//       console.log("Updating existing movie metadata:", movieData.title);
//       return await this.movieRepository.update(movieData._id, movieData);
//     } else {
//       console.log("NO exists")

//       console.log("Creating new movie metadata:", movieData.title);
//       return await this.movieRepository.create(movieData);
//     }
//     // console.log("from usercase", movieData);
//     // const movie = await this.movieRepository.create(movieData);

//     // return movie;
//   }
// }
