import { IVideoCatalogRepository } from "../domain/interface/IVideoCatalogRepositoryl";
import { IVideoMetadataRepository } from "../domain/interface/IVideoMetadataRepository";

export class GetMovieCatalog {
  private repository: IVideoCatalogRepository;
  private metaRepository: IVideoMetadataRepository;
  constructor(
    repository: IVideoCatalogRepository,
    metaRepository: IVideoMetadataRepository
  ) {
    this.repository = repository;
    this.metaRepository = metaRepository;
  }
  async execute(id: string) {
    const movie = await this.metaRepository.findById(id);
    if(movie.block){
        throw new Error("Movie is blocked");
    }
    return await this.repository.getCatalog(id);
  }
}
