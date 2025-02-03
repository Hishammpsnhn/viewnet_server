import { IVideoCatalogRepository } from "../domain/interface/IVideoCatalogRepositoryl";

export class GetMovieCatalog{
    private repository:IVideoCatalogRepository;
    constructor(repository:IVideoCatalogRepository) {
        this.repository = repository;
    }
    async execute(id:string) {
        return await this.repository.getCatalog(id);
    }
}