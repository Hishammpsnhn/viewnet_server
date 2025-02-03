import { MovieCatalog } from "../entities/VideoCatalog";

export interface IVideoCatalogRepository {
  getCatalog(id:string): Promise<MovieCatalog>;
}
