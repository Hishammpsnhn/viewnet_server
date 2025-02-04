import { IVideoMetadataRepository } from "../domain/interface/IVideoMetadataRepository";

export class GetMovieMeta {
  private repository: IVideoMetadataRepository;
  constructor(repository: IVideoMetadataRepository) {
    this.repository = repository;
  }
  async execute(id: string) {
    const meta = await this.repository.findById(id);
    if(meta.block){
        throw new Error("Movie is blocked");
    }
    return meta;
  }
}
