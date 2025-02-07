export interface GenreProps {
    id?: string; 
    name: string; 
    description?: string; 
    isActive?: boolean; 
  }
  
  export class Genre {
    public readonly id?: string;
    public readonly name: string;
    public readonly description: string;
    public readonly isActive?: boolean;
  

    constructor(props: GenreProps) {
      
  
      if (!props.name || typeof props.name !== "string") {
        throw new Error("Genre name must be a non-empty string.");
      }
  
      this.id = props.id;
      this.name = props.name;
      this.description = props.description || "";
      this.isActive = props.isActive 
    }
  
 
    toPlainObject(): GenreProps {
      return {
        id: this.id|| "",
        name: this.name,
        description: this.description,
        isActive: this.isActive,
      };
    }
  
  
    static fromPlainObject(plainObject: GenreProps): Genre {
      return new Genre({
        id: plainObject.id,
        name: plainObject.name,
        description: plainObject.description || "",
        isActive: plainObject.isActive,
      });
    }
  }
  