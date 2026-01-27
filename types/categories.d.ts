type ISubCategory = {
  description: string;
  id: string;
  imgUrl: string;
  is_active: boolean;
  is_hidden: boolean;
  mainCategoryId: number;
  name: string;
  slug: string;
};

type ICategory = {
  cgst: string;
  commission: string;
  createdAt: string;
  description: string;
  id: 20;
  igst: string;
  imgUrl: string;
  is_active: boolean;
  is_hidden: boolean;
  name: string;
  plateform_fee: string;
  sgst: string;
  slug: string;
  subCategories: Array<ISubCategory>;
};

export { ICategory };
