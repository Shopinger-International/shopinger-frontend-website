import type IUser from "@types/user";
import type IMedia from "@types/media";
import type IUser from "@types/user";

type IReviewMedia = {
  media: IMedia;
};

type IReview = {
  id: number;
  user_id: number;
  user: IUser;
  created_at: string;
  product_id: number;
  variant_id: number;
  rating: number;
  title: string;
  comment: string;
  helpful_count: number;
  is_verified_purchase: boolean;
  is_approved: boolean;
  variant_snapshot: {
    attributes: {
      [key: string]: any;
    };
  };
  order_item_id: number;
  review_medias: IReviewMedia[];
  user: IUser;
  is_reacted: boolean;
};

export default IReview;
