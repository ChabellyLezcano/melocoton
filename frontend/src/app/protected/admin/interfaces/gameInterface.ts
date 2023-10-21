export interface GameResponse {
    ok:    boolean;
    game: Game;
    games: Game[];
    msg?: string;
}

export interface Game {
    _id:            string;
    photo:          string;
    title:          string;
    description:    string;
    status:         String;
    tags:           string[];
    rules:         string;
    __v:            number;
    gallery_images: GalleryImage[];
    code:           string;
    objective:     string;
}

export interface GalleryImage {
    label: Label;
    path:  string;
    _id:   string;
}

export enum Label {
    Image1 = "image1",
    Image2 = "image2",
    Image3 = "image3",
}

