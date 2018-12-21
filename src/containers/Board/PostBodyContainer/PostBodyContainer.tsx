import * as React from 'react';
import { RootState } from '../../../reducers';
import { returntypeof } from 'react-redux-typescript';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {PostContainer} from "..";
import {PostBody} from "../../../components/Board/PostBody/PostBody";
import * as moment from "moment";

const mapStateToProps = (state: RootState) => ({
  isLogin: state.authentication.status.isLogin,
  isAdmin: state.authentication.status.isAdmin,
  id: state.authentication.userInfo.id
});

const statePropTypes = returntypeof(mapStateToProps);

export namespace PostBodyContainer {
  export interface SubProps {
    post: PostContainer.Info,
    onVoteSubmit: (selectedOptions : number[]) => void
  }

  export interface State {
    selectedOptions: {[optionValue:number]: boolean},
    votedId: Array<number>,
    voteHasFinished: boolean
  }

  export type Props = typeof statePropTypes & SubProps
}

class PostBodyContainerClass extends React.Component<PostBodyContainer.Props, PostBodyContainer.State> {
  constructor(props : PostBodyContainer.Props) {
    super(props);

    this.state = {
      selectedOptions: {},
      votedId: [],
      voteHasFinished: false
    }
  }

  componentDidMount() {
    this.checkHasVoted();
    this.checkVoteHasFinished();
  }

  checkHasVoted = () => {
    const { post, id } = this.props;
    if(post.vote !== null) {
      let votedId: Array<number> = [];
      post.vote.options.forEach((option) => {
        option.voters.forEach((voter) => {
          if(voter.loginID === id) {
            votedId.push(option.id);
          }
        })
      });

      this.setState((prevState, props) => {
        if(prevState.votedId !== votedId) {
          return { votedId: votedId }
        }
      })
    }
  };

  checkVoteHasFinished = () => {
    const { post } = this.props;
    if(post.vote !== null) {
      const deadlineInUTC = moment(moment.utc(post.vote.deadline), 'YYYY-MM-DD HH:mm:ss');
      const now = moment(moment.utc(), 'YYYY-MM-DD HH:mm:ss');

      if (now.diff(deadlineInUTC, "seconds") > 0) {
        this.setState({
          voteHasFinished: true
        })
      }
    }
  };

  checkVote = (event : React.FormEvent<HTMLInputElement>) => {
    const { selectedOptions } = this.state;
    const { isMultipleSelectable } = this.props.post.vote;
    const _resetOptions = (options: {[optionValue:number]:boolean}) => {
      let returnObject = {};
      for(let key of Object.keys(options)) {
        returnObject = {...returnObject, [key]:false}
      }
      return returnObject;
    };

    let currentSelectedOptions : {[optionValue:number]:boolean};
    if(isMultipleSelectable) {
      currentSelectedOptions = {...selectedOptions, [event.currentTarget.value] : event.currentTarget.checked };
    } else {
      const resetOptions = _resetOptions(selectedOptions);
      currentSelectedOptions = {...resetOptions, [event.currentTarget.value] : event.currentTarget.checked};
    }

    this.setState({
      selectedOptions: currentSelectedOptions
    });
  };

  handleVoteSubmit = (event : React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { onVoteSubmit } = this.props;
    const { selectedOptions } = this.state;
    const votedId: Array<number> = [];

    let submitOptions : number[] = [];
    for(let _optionID of Object.keys(selectedOptions)) {
      const optionID = parseInt(_optionID);
      if(selectedOptions[optionID]) {
        submitOptions = submitOptions.concat(optionID);
        votedId.push(optionID);
      }
    }

    if(Object.keys(this.state.selectedOptions).length <= 0) {
      if(!confirm("투표항목을 선택하지 않으셨습니다. 계속 하시겠습니까?")) {
        return;
      }
    }

    onVoteSubmit(submitOptions);
    this.setState({
      selectedOptions: {},
      votedId: votedId
    })
  };

  handleReVote = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      votedId: []
    })
  };

  render() {
    return (
      <PostBody post={this.props.post} handleVoteSubmit={this.handleVoteSubmit}
                checkVote={this.checkVote} handleReVote={this.handleReVote}
                votedId={this.state.votedId} hasLogin={this.props.isLogin}
                voteHasFinished={this.state.voteHasFinished}
      />
    )
  }

}

export const PostBodyContainer = compose(connect(mapStateToProps))(PostBodyContainerClass);
