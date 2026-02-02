export interface ImageUrl {
  uid: string;
  name: string;
  status: "uploading" | "done" | "error";
  url: string;
  progress: number;
  errorMsg: string;
}
