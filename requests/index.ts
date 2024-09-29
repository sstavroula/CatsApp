import {
  AddedFavouriteSchema,
  VotedSchema,
  VotesListSchema,
} from './../data/index';
import Config from 'react-native-config';
import {CatListSchema, MyAsset} from '../data';

const API_KEY = Config.API_KEY;

if (!API_KEY) {
  throw new Error('Unexpected: API_KEY not defined');
}

export const getMyCats = async (
  page: number,
  limit: number,
  userId: string,
) => {
  const response = await fetch(
    `https://api.thecatapi.com/v1/images/?limit=${limit}&page=${page}&sub_id=${userId}&order=DESC&api_key=${API_KEY}`,
  );

  const result = CatListSchema.parse(await response.json());
  return result;
};

export const addToFavorites = async (imageId: string, userId: string) => {
  const response = await fetch('https://api.thecatapi.com/v1/favourites', {
    method: 'POST',
    body: JSON.stringify({image_id: imageId, sub_id: userId}),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
  });

  const result = AddedFavouriteSchema.parse(await response.json());
  return result;
};

export const removeFromFavorites = async (favouriteId: number) => {
  const response = await fetch(
    `https://api.thecatapi.com/v1/favourites/${favouriteId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Removing favourite failed');
  }
};

export const getImageVotes = async (page: number) => {
  const response = await fetch(
    `https://api.thecatapi.com/v1/votes?page=${page}&limit=100&api_key=${API_KEY}`,
  );

  const result = VotesListSchema.parse(await response.json());
  return result;
};

export const voteImage = async (
  imageId: string,
  userId: string,
  value: number,
) => {
  const response = await fetch('https://api.thecatapi.com/v1/votes', {
    method: 'POST',
    body: JSON.stringify({image_id: imageId, value, sub_id: userId}),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
  });

  const result = VotedSchema.parse(await response.json());
  return result;
};

export const removeVote = async (id: number) => {
  const response = await fetch(`https://api.thecatapi.com/v1/votes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Removing vote failed');
  }
};

export const uploadCatPhoto = async (asset: MyAsset, userId: string) => {
  const {uri, fileName, type} = asset;

  const formData = new FormData();
  formData.append('file', {
    uri: uri,
    type: type,
    name: fileName,
  });
  formData.append('sub_id', userId);

  const response = await fetch(`https://api.thecatapi.com/v1/images/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-api-key': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }
};
