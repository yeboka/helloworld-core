import { gql } from "@apollo/client";


// Apollo doesn't recommend using a 'graphql upload' lib to submitting files because it has vulnerabilities with CSRF attacks
// They are recommend using pre signed url uploading of files

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
