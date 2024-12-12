import { Request, Response } from "express";
import { PagingDTOSchema } from "../../../../share/model/paging";
import { ICategoryUseCase } from "../../interface";
import { CategoryCondDTOSchema, CategoryUpdateSchema } from "../../model/dto";

export class CategoryHttpService {
  constructor(private readonly useCase: ICategoryUseCase) { }

  async createANewCategoryAPI(req: Request, res: Response) {
    try {
      const result = await this.useCase.createANewCategory(req.body);
      res.status(201).json({ data: result });
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      });
    }
  }

  async getDetailCategoryAPI(req: Request, res: Response) {
    const { id } = req.params;

    const result = await this.useCase.getDetailCategory(id);
    res.status(200).json({ data: result });
  }

  async updateCategoryAPI(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = CategoryUpdateSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        message: error.message,
      });

      return;
    }

    const result = await this.useCase.updateCategory(id, data);
    res.status(200).json({ data: result });
  }

  async deleteCategoryAPI(req: Request, res: Response) {
    const { id } = req.params;

    const result = await this.useCase.deleteCategory(id);
    res.status(200).json({ data: result });
  }

  async listCategoryAPI(req: Request, res: Response) {
    const { success, data: paging, error } = PagingDTOSchema.safeParse(req.query);

    if (!success) {
      res.status(400).json({
        message: 'Invalid paging',
        error: error.message,
      });

      return;
    }

    const cond = CategoryCondDTOSchema.parse(req.query);

    const result = await this.useCase.listCategories(cond, paging);
    res.status(200).json({ data: result, paging, filter: cond });
  }
}
