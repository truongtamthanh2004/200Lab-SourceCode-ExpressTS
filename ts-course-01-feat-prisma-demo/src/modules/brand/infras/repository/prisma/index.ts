import { IBrandRepository } from "@modules/brand/interface";
import { Brand } from "@modules/brand/model/brand";
import { BrandCondDTO, BrandUpdateDTO } from "@modules/brand/model/dto";
import prisma from "@share/component/prisma";
import { ModelStatus } from "@share/model/base-model";
import { PagingDTO } from "@share/model/paging";

export class BrandPrismaRepository implements IBrandRepository {
  async get(id: string): Promise<Brand| null> {
    const brand = await prisma.brand.findUnique({where: {id}})

    if (!brand) return null

    return {...brand, status: brand.status as ModelStatus} as Brand
  }

// TODO: interface vs type in TS

  async findByCond(cond: BrandCondDTO): Promise<Brand | null> {
    const brand = await prisma.brand.findFirst({where: cond})

    if (!brand) return null

    return {...brand, status: brand.status as ModelStatus} as Brand
  }

  async list(cond: BrandCondDTO, paging: PagingDTO): Promise<Brand[]> {
    const brands = await prisma.brand.findMany({where: cond, skip: paging.limit * (paging.page - 1), take: paging.limit})
    return brands.map(brand => ({...brand, status: brand.status as ModelStatus} as Brand))
  }

  async listByIds(ids: string[]): Promise<Brand[]> {
    const brands = await prisma.brand.findMany({where: {id: {in: ids}}})
    return brands.map(brand => ({...brand, status: brand.status as ModelStatus} as Brand))
  }

  async insert(data: Brand): Promise<boolean> {
    await prisma.brand.create({data})
    return true
  }

  async update(id: string, data: BrandUpdateDTO): Promise<boolean> {
    await prisma.brand.update({where: {id}, data})
    return true
  }

  async delete(id: string, isHard: boolean): Promise<boolean> {
    isHard ?
      await prisma.brand.delete({where: {id}}) :
      await prisma.brand.update({where: {id}, data: {status: ModelStatus.DELETED}})

    return true
  }

}