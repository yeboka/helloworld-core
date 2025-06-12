import { gql } from "@apollo/client";

export const GET_S3_SIGNED_URL_MUTATION = gql`
    mutation GetS3SignedUrl($fileName: String!, $fileType: String!) {
        getS3SignedUrl(fileName: $fileName, fileType: $fileType) {
            uploadUrl
            imageUrl
        }
    }
`

export const CREATE_IMAGE_MUTATION = gql`
    mutation CreateImage($url: String!) {
        createImage(url: $url) {
            url
        }
    }
`
