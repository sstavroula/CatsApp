import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {Cat} from '../data';
import {voteImage, removeVote} from '../requests';
import {notReached} from '../utils';
import {useUserId} from '../providers/UserProvider';

type VoteState =
  | {type: 'voted'; voteId: number; value: number}
  | {type: 'notVoted'}
  | {type: 'removing'}
  | {type: 'voting'; value: number};

export const Vote = ({cat, initialVotes}: {cat: Cat; initialVotes: number}) => {
  const userId = useUserId();

  const [state, setState] = useState<VoteState>(
    cat.vote
      ? {type: 'voted', voteId: cat.vote.id, value: cat.vote.value}
      : {type: 'notVoted'},
  );

  const scoreWithoutUserVote = initialVotes - (cat.vote?.value || 0);

  const userVote = (() => {
    switch (state.type) {
      case 'notVoted':
      case 'removing':
        return 0;
      case 'voted':
      case 'voting':
        return state.value;
      default:
        return notReached(state);
    }
  })();

  const score = scoreWithoutUserVote + userVote;

  const vote = async (value: number) => {
    setState({type: 'voting', value});
    try {
      const {id: voteId} = await voteImage(cat.id, userId, value);
      setState({type: 'voted', voteId, value});
    } catch (e) {
      setState({type: 'notVoted'});
    }
  };

  const updateVote = async (previousVoteId: number, value: number) => {
    setState({type: 'voting', value});
    try {
      await removeVote(previousVoteId);
      const {id: voteId} = await voteImage(cat.id, userId, value);
      setState({type: 'voted', voteId, value});
    } catch (e) {
      setState({type: 'notVoted'});
    }
  };

  const unvote = async (voteId: number, value: number) => {
    setState({type: 'removing'});
    try {
      await removeVote(voteId);
      setState({type: 'notVoted'});
    } catch (e) {
      setState({type: 'voted', voteId, value});
    }
  };

  return (
    <View>
      {(() => {
        switch (state.type) {
          case 'notVoted':
            return (
              <View style={styles.votingParent}>
                <IconButton
                  icon={'thumb-up-outline'}
                  onPress={() => vote(1)}
                  size={18}
                />
                <IconButton
                  icon={'thumb-down-outline'}
                  onPress={() => vote(-1)}
                  size={18}
                />
              </View>
            );

          case 'voted':
            return (
              <View style={styles.votingParent}>
                <IconButton
                  icon={state.value === 1 ? 'thumb-up' : 'thumb-up-outline'}
                  onPress={() =>
                    state.value === 1
                      ? unvote(state.voteId, state.value)
                      : updateVote(state.voteId, 1)
                  }
                  size={18}
                />
                <IconButton
                  icon={
                    state.value === -1 ? 'thumb-down' : 'thumb-down-outline'
                  }
                  onPress={() =>
                    state.value === -1
                      ? unvote(state.voteId, state.value)
                      : updateVote(state.voteId, -1)
                  }
                  size={18}
                />
              </View>
            );

          case 'removing':
            return (
              <View style={styles.votingParent}>
                <IconButton icon={'thumb-up-outline'} size={18} />
                <IconButton icon={'thumb-down-outline'} size={18} />
              </View>
            );
          case 'voting':
            return (
              <View style={styles.votingParent}>
                <IconButton
                  icon={state.value === 1 ? 'thumb-up' : 'thumb-up-outline'}
                  size={18}
                />
                <IconButton
                  icon={
                    state.value === -1 ? 'thumb-down' : 'thumb-down-outline'
                  }
                  size={18}
                />
              </View>
            );
          default:
            return notReached(state);
        }
      })()}
      <Text variant="labelMedium" style={styles.score}>
        Score: {score}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  votingParent: {
    flexDirection: 'row',
  },
  score: {
    padding: 10,
    paddingTop: 0,
  },
});
