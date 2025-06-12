import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Image, ImageModel, SignedUrlResponse } from "../models/image.js";
import { getSignedUrl } from "../services/s3Service.js";

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

  @Mutation(() => SignedUrlResponse)
  async getS3SignedUrl(
    @Arg("fileName") fileName: string,
    @Arg("fileType") fileType: string,
  ) {
    return getSignedUrl(fileName, fileType);
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