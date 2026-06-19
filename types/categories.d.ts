
interface IBaseCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  imgUrl: string;

  cgst: string;
  sgst: string;
  igst: string;
  commission: string;
  plateform_fee: string;

  is_active: boolean;
  is_hidden: boolean;
  createdAt: string;
}

interface ISubSubCategory extends IBaseCategory {}
interface ISubCategory extends IBaseCategory {
  subSubCategories: ISubSubCategory[];
}
interface ICategory extends IBaseCategory {
  subCategories: ISubCategory[];
}

export { ISubSubCategory, ISubCategory, ICategory };
