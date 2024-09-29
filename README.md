
Before the usual steps to run the react native application, please create a .env file with your API key:

```
API_KEY=live_...
```

Then:

```
yarn install
cd ios
pod install
yarn ios
yarn android
```

I used:
- React Native Paper
- React Native uuid for generating the user id
- React Native Config to read from the .env file
- AsyncStorage to save the user ID
- Zod, for data parsing
- react-native-image-picker to get access with images

The logic to handle favourites and votes uses local state, to make interactions faster. After the server data is updated using the API, (for example, after the user up-votes) we update the local state and do not retrieve the affected image again. Of course, on restarting the app, the new data for the image is retrieved and used.

Retrieving data to calculate the score is done in a not scalable way, as the code retrieves all the scores for all the images. I could not find a way, using the existing API documentation, to do it differently. In a situation where there are a lot of images and votes, this solution would not work well and we would need access to a more appropriate API.

The test specification is targeting web, and I adapted to mobile. In particular, the cat image size is smaller.

