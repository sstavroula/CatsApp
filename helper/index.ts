import {Vote} from '../data';
import {getImageVotes} from '../requests';

export const getAllImageVotesDict = async () => {
  const votesList = await getAllImageVotesList();

  const dict = {} as Record<string, number>;
  votesList.forEach(vote => {
    dict[vote.image_id] = (dict[vote.image_id] || 0) + vote.value;
  });
  return dict;
};

export const getAllImageVotesList = async () => {
  let allList: Vote[] = [];
  let newList: Vote[] = [];
  let page = 0;
  do {
    newList = await getImageVotes(page);
    allList = [...allList, ...newList];
    page += 1;
  } while (newList.length > 0);
  return allList;
};
