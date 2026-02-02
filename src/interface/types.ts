// export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface ImageUrl {
  uid: string;
  name: string;
  status: "uploading" | "done" | "error";
  url: string;
  progress: number;
}
