import { IUseCase } from "@share/interface";
import { ProductCondDTO, ProductCreateDTO, ProductUpdateDTO } from "../model/dto";
import { Product } from "../model/product";

export interface IProductUseCase extends IUseCase<ProductCreateDTO, ProductUpdateDTO, Product, ProductCondDTO> {}

