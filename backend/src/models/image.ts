import {prop, getModelForClass} from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Image {
  @Field(() => ID)
  readonly id!: string;

  @Field()
  @prop({required: true})
  url!: string;

  @Field({nullable: true})
  @prop({required: false})
  description?: string;
}

@ObjectType()
export class SignedUrlResponse {
  @Field()
  uploadUrl!: string;

  @Field()
  imageUrl!: string;
}

export const ImageModel = getModelForClass(Image);