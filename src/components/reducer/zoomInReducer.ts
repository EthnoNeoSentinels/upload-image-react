import type { ImageUrl } from "../interface/types";

export type State = {
  imageUrlArray: ImageUrl[];
  isZoomIn: boolean;
  zoomInImage: ImageUrl | null;
};

type Action =
  | { type: "Open_Zoom_In"; payload: { uid: string } }
  | { type: "Close_Zoom_In"; payload: {} }
  | { type: "Add_Image"; payload: {} }
  | { type: "Delete_Image"; payload: {} };

export function zoomInReducer(state: State, action: Action): State {
  switch (action.type) {
    case "Open_Zoom_In":
      const image = state.imageUrlArray.find(
        (image) => image.uid === action.payload.uid,
      );

      return state;
    case "Close_Zoom_In":
      return state;
    case "Add_Image":
      return state;
    case "Delete_Image":
      return state;
    default:
      return state;
  }
}
