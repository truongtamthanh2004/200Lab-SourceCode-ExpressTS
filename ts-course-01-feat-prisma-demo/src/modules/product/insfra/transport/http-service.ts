import { IBrandQueryRepository, ICategoryQueryRepository, IProductUseCase } from "@modules/product/interface";
import { ProductCondDTO, ProductCreateDTO, ProductUpdateDTO } from "@modules/product/model/dto";
import { Product } from "@modules/product/model/product";
import { IQueryRepository } from "@share/interface";
import { BaseHttpService } from "@share/transport/http-server";
import { Request, Response } from "express";

export class ProductHTTPService extends BaseHttpService<Product, ProductCreateDTO, ProductUpdateDTO, ProductCondDTO> {
  constructor(
    useCase: IProductUseCase, 
    private readonly productBrandRepository: IBrandQueryRepository,
    private readonly productCategoryRepository: ICategoryQueryRepository,
    private readonly prodQueryRepo: IQueryRepository<Product, ProductCondDTO>
  ) {
    super(useCase);
  }

  async getDetailAPI(req: Request, res: Response) {
    const { id } = req.params;

    const result = await this.useCase.getDetail(id);

    const brand = await this.productBrandRepository.get(result!.brandId!);
    
    if (brand) {
      result!.brand = brand!;
    }

    const category = await this.productCategoryRepository.get(result!.categoryId!);
    
    if (category) {
      result!.category = category!;
    }
      
    res.status(200).json({ data: result });
  }

  async listProductByIdsAPI(req: Request, res: Response) {
    const { ids } = req.body;
    const result = await this.prodQueryRepo.listByIds(ids);
    res.status(200).json({ data: result });
  }
}

