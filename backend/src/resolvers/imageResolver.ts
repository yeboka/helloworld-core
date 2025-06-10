import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Image, ImageModel } from "../models/image.js";

@Resolver(Image)
export class ImageResolver {

  @Query(() => Image)
  async image(@Arg("id", ()=>ID) id: string) {
    return ImageModel.findById(id);
  }

  @Query(() => [Image])
  async images() {
    return ImageModel.find();
  }

  @Mutation(() => Image)
  async createImage(
    @Arg("url") url: string,
    @Arg("description", {nullable: true}) description?: string
  ) {
    console.log("Creating image: ", description, " ", url)
    return await ImageModel.create({
      url: url,
      description: description
    });
  }
}