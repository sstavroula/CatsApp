import {
  getMyCats,
  addToFavorites,
  removeFromFavorites,
  getImageVotes,
  voteImage,
  removeVote,
  uploadCatPhoto,
} from '../requests';

beforeEach(() => {
  fetchMock.resetMocks();
});

test('getMyCats fetches cat images successfully', async () => {
  fetchMock.mockResponseOnce(
    JSON.stringify([
      {id: 'cat1', url: 'https://caturl.com', width: null, height: null},
    ]),
  );

  const result = await getMyCats(0, 10, 'test-user-id');
  expect(result).toEqual([
    {id: 'cat1', url: 'https://caturl.com', width: null, height: null},
  ]);
});

test('addToFavorites adds a cat to favorites successfully', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({id: 1}));

  const result = await addToFavorites('cat1', 'test-user-id');
  expect(result).toEqual({id: 1});
});

test('removeFromFavorites removes a cat from favorites successfully', async () => {
  fetchMock.mockResponseOnce('', {status: 200});

  await expect(removeFromFavorites(1)).resolves.toBeUndefined();
});

test('getImageVotes fetches image votes successfully', async () => {
  fetchMock.mockResponseOnce(
    JSON.stringify([
      {
        id: 1,
        image_id: 'cat1',
        value: 1,
        created_at: new Date().toISOString(),
        sub_id: '2342423',
      },
    ]),
  );

  const result = await getImageVotes(0);
  expect(result).toEqual([
    {
      id: 1,
      image_id: 'cat1',
      value: 1,
      created_at: expect.any(String),
      sub_id: '2342423',
    },
  ]);
});

test('voteImage casts a vote for a cat image successfully', async () => {
  fetchMock.mockResponseOnce(
    JSON.stringify({id: 1, image_id: 'cat1', value: 1, sub_id: '2342423'}),
  );

  const result = await voteImage('cat1', 'test-user-id', 1);
  expect(result).toEqual({
    id: 1,
    image_id: 'cat1',
    value: 1,
    sub_id: '2342423',
  });
});

test('removeVote removes a vote for a cat image successfully', async () => {
  fetchMock.mockResponseOnce('', {status: 200});

  await expect(removeVote(1)).resolves.toBeUndefined();
});

test('uploadCatPhoto uploads a cat photo successfully', async () => {
  fetchMock.mockResponseOnce('', {status: 200});

  const asset = {
    uri: 'file://path/to/cat.jpg',
    fileName: 'cat.jpg',
    type: 'image/jpeg',
  };

  await expect(uploadCatPhoto(asset, 'test-user-id')).resolves.toBeUndefined();
});
