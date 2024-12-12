import { IProductUseCase } from "@modules/product/interface";
import { ProductCondDTO, ProductCreateDTO, ProductUpdateDTO } from "@modules/product/model/dto";
import { Product } from "@modules/product/model/product";
import { BaseHttpService } from "@share/transport/http-server";

export class ProductHTTPService extends BaseHttpService<Product, ProductCreateDTO, ProductUpdateDTO, ProductCondDTO> {
  constructor(useCase: IProductUseCase) {
    super(useCase);
  }
}

