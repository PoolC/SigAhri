import * as React from 'react';
import { RootState } from '../../../reducers';
import { returntypeof } from 'react-redux-typescript';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {PostContainer} from "..";
import {PostBody} from "../../../components/Board/PostBody/PostBody";

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
    hasVoted: boolean // TODO: 이미 투표했는지 정보 가져오기
  }

  export type Props = typeof statePropTypes & SubProps
}

class PostBodyContainerClass extends React.Component<PostBodyContainer.Props, PostBodyContainer.State> {
  constructor(props : PostBodyContainer.Props) {
    super(props);

    this.state = {
      selectedOptions: {},
      hasVoted: false
    }
  }

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

    let submitOptions : number[] = [];
    for(let _optionID of Object.keys(selectedOptions)) {
      const optionID = parseInt(_optionID);
      if(selectedOptions[optionID]) {
        submitOptions = submitOptions.concat(optionID);
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
      hasVoted: true
    })
  };

  handleReVote = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      hasVoted: false
    })
  };

  render() {
    return (
      <PostBody post={this.props.post} handleVoteSubmit={this.handleVoteSubmit}
                checkVote={this.checkVote} handleReVote={this.handleReVote}
                hasVoted={this.state.hasVoted} hasLogin={this.props.isLogin}
      />
    )
  }

}

export const PostBodyContainer = compose(connect(mapStateToProps))(PostBodyContainerClass);
