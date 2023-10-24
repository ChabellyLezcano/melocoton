export interface BlogResponse {
    ok:       boolean;
    msg:      string;
    articles: Article[];
    article: Article;
}

export interface Article {
    _id:      string;
    title:    string;
    text:     string;
    tags:     string[];
    author:   Author | null;
    date:     Date;
    likes:    Like[];
    __v:      number;
    numLikes: number;
    photo?:   string;
}

export interface Author {
    _id:      string;
    username: string;
    photo: string;
}

export interface Like {
    user: string;
    _id:  string;
}