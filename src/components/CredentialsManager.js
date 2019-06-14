import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { selectSettings } from '../selectors';
import { loadSettings } from '../actions';
import { postData, putData } from '../api';

import CashNotifcationSettings from './CashNotificationSettings';
import DriftNotifcationSettings from './DriftNotificationSettings';

import styled from '@emotion/styled';
import { InputNonFormik } from '../styled/Form';
import { H2, Edit, Span } from '../styled/GlobalElements';
import { Button } from '../styled/Button';
import ShadowBox from '../styled/ShadowBox';

const InputContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 5px;
  font-size: 18px;
`;

const TextContainer = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
`;

export class CredentialsManager extends React.Component {
  state = {
    name: this.props.settings && this.props.settings.name,
    email: this.props.settings && this.props.settings.email,
    editingName: false,
    passwordResetSent: false,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.settings && nextProps.settings.name,
      email: nextProps.settings && nextProps.settings.email,
    });
  }

  startEditingName() {
    this.setState({ editingName: true });
  }

  onEnter = e => {
    if (e.key === 'Enter') {
      this.finishEditing();
    }
  };

  finishEditing() {
    if (this.state.name !== this.props.settings.name) {
      let settings = Object.assign({}, this.props.settings);
      if (this.state.name === '') {
        settings.name = null;
      } else {
        settings.name = this.state.name;
      }

      putData('/api/v1/settings/', settings)
        .then(response => {
          this.props.refreshSettings();
        })
        .catch(error => {
          this.props.refreshSettings();
        });
    }
    this.setState({ editingName: false });
  }

  sendPasswordReset() {
    postData('/api/v1/auth/resetPassword/', { email: this.state.email })
      .then(response => {
        this.setState({ passwordResetSent: true });
      })
      .catch(error => {
        this.setState({ passwordResetSent: false });
        console.log('error', error.response.data);
      });
  }

  sendPasswordResetOkay() {
    this.setState({ passwordResetSent: false });
  }

  render() {
    return (
      <ShadowBox>
        <H2>Passiv Credentials</H2>
        <TextContainer>
          {this.state.editingName ? (
            <InputContainer>
              <InputNonFormik
                value={this.state.name === null ? '' : this.state.name}
                onChange={event => {
                  this.setState({ name: event.target.value });
                }}
                onKeyPress={this.onEnter}
              />
              <Button onClick={() => this.finishEditing()}>Done</Button>
            </InputContainer>
          ) : (
            <InputContainer>
              <strong>Name:</strong>{' '}
              {this.state.name === null ? '[no name set]' : this.state.name}
              <Edit onClick={() => this.startEditingName()}>
                <FontAwesomeIcon icon={faPen} />
                Edit
              </Edit>
            </InputContainer>
          )}
        </TextContainer>
        <TextContainer>
          <InputContainer>
            <strong>Email:</strong> {this.state.email}
          </InputContainer>
        </TextContainer>
        <TextContainer>
          <InputContainer>
            <strong>Change your Password:</strong>{' '}
            {this.state.passwordResetSent ? (
              <React.Fragment>
                <Span>A password reset email has been sent to you.</Span>
                <Edit onClick={() => this.sendPasswordResetOkay()}>Okay</Edit>
              </React.Fragment>
            ) : (
              <Edit onClick={() => this.sendPasswordReset()}>Change</Edit>
            )}
          </InputContainer>
        </TextContainer>
        <CashNotifcationSettings />
        <DriftNotifcationSettings />
      </ShadowBox>
    );
  }
}

const select = state => ({
  settings: selectSettings(state),
});
const actions = {
  refreshSettings: loadSettings,
};

export default connect(
  select,
  actions,
)(CredentialsManager);
