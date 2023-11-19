export interface ReviewResponse {
    ok:      boolean;
    msg:     string;
    reviews: Review[];
}

export interface Review {
    _id:         string;
    title:       string;
    description: string;
    user:     {
        username: string,
        photo: string
    }
    game:        string;
    rating:      number;
    date:        Date;
    __v:         number;
}
