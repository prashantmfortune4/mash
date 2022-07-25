import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  StyleSheet,
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {compose, graphql} from 'react-apollo';
import apolloClient from '../../graphql/client';
import {ADD_USER} from '../../graphql/mutations';
import {AUTH_USER} from '../../graphql/queries';
import {loginSuccess} from '../../actions/login';
import {getCart} from '../../actions/cart';
import styles from './styles';
import {colors} from '../../constants/colors';
import Spinner from '../../containers/Spinner';
import RCTextInput from '../../containers/TextInput';
import Button from '../../containers/Button';
import WrongInputWarning from '../../containers/WrongInputWarning';
import {
  validateEmail,
  validateMobile,
  validatePassword,
} from '../../utils/validators';
import {setData, getData, deleteData} from '../../utils/storage';
import {CustomIcon} from '../../utils/Icons';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      mobile: '',
      email: '',
      password: '',
      confirmPassword: '',
      saving: false,
      errorText: null,
      isLoading: false,
    };
    this.focusListener = this.props.navigation.addListener(
      'willFocus',
      async () => {
        this.setState({isLoading: true});
        const token = JSON.parse(await getData('token'));
        if (token) {
          this.props.navigation.navigate('Profile');
        }
        this.setState({isLoading: false});
        this.setState({
          name: '',
          mobile: '',
          email: '',
          password: '',
          confirmPassword: '',
          saving: false,
          errorText: null,
        });
      },
    );
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  valid = () => {
    const {name, mobile, email, password, confirmPassword} = this.state;

    if (name.trim() === '') {
      this.setState({errorText: 'Please enter user name'});
      this.nameInput.focus();
      return false;
    }
    if (!validateMobile(mobile)) {
      const errorText =
        mobile.trim() === ''
          ? 'Please enter phone number'
          : 'Enter valid phone number';
      this.setState({errorText});
      this.mobileInput.focus();
      return false;
    }
    if (!validateEmail(email)) {
      const errorText =
        email.trim() === '' ? 'Please enter email' : 'Enter valid email';
      this.setState({errorText});
      this.emailInput.focus();
      return false;
    }
    if (!validatePassword(password)) {
      const errorText =
        password.trim() === ''
          ? 'Please enter password'
          : 'Enter atleast six character password';
      this.setState({errorText});
      this.passwordInput.focus();
      return false;
    }
    if (password !== confirmPassword) {
      const errorText =
        confirmPassword.trim() === ''
          ? 'Please enter confirm password'
          : 'Password and confirm password does not match';
      this.setState({errorText});
      this.confirmPasswordInput.focus();
      return false;
    }
    return true;
  };

  submit = async () => {
    if (!this.valid()) {
      return;
    }
    this.setState({saving: true});
    Keyboard.dismiss();

    const {name, email, mobile, password} = this.state;

    try {
      const result = await this.props.addUser({
        variables: {
          name,
          email,
          mobile,
          password,
        },
      });
      if (
        result &&
        result.data &&
        result.data.addUser &&
        result.data.addUser._id
      ) {
        await this.loginAfterSignUp();
      }
    } catch (error) {
      try {
        this.setState({errorText: error.graphQLErrors[0].message});
      } catch (e) {
        this.setState({errorText: 'Unable to sign up..something went wrong'});
      }
      this.scroll.scrollTo({x: 0, y: 0, animated: true});
    }
    this.setState({saving: false});
  };

  loginAfterSignUp = async () => {
    const credentials = {
      email: this.state.email,
      password: this.state.password,
    };
    const tempUserId = JSON.parse(await getData('tempUserId'));
    if (tempUserId) {
      credentials.userId = tempUserId;
    }

    try {
      const {data} = await apolloClient.query({
        query: AUTH_USER,
        variables: {
          ...credentials,
        },
      });
      if (data && data.authUser) {
        const {params} = this.props.navigation.state;
        await setData('token', data.authUser.token);
        await this.props.loginSuccess(data.authUser);
        await deleteData('tempUserId');
        await this.props.getCart();
        if (params && params.from && params.from === 'cartScreen') {
          this.props.navigation.navigate('Cart');
        } else if (
          params &&
          params.from &&
          params.from === 'buyNow' &&
          params.product &&
          params.product.productId
        ) {
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'Main',
                  action: NavigationActions.navigate({
                    routeName: 'SelectAddress',
                    params: {product: params.product},
                  }),
                }),
              ],
            }),
          );
        } else {
          this.props.navigation.navigate('Home');
        }
      }
    } catch (error) {
      try {
        this.setState({errorText: error.graphQLErrors[0].message});
      } catch (e) {
        this.setState({errorText: 'Unable to login..something went wrong'});
      }
      this.scroll.scrollTo({x: 0, y: 0, animated: true});
      this.setState({saving: false});
    }
  };

  openLogin = () => {
    const {navigation} = this.props;
    const params = {};
    if (
      navigation &&
      navigation.state &&
      navigation.state.params &&
      navigation.state.params.from
    ) {
      params.from = navigation.state.params.from;
      if (
        navigation.state.params.from == 'buyNow' &&
        navigation.state.params.product
      ) {
        params.product = navigation.state.params.product;
      }
    }
    navigation.navigate('Login', params);
  };

  render() {
    const {navigation} = this.props;
    const {
      errorText,
      name,
      email,
      mobile,
      password,
      confirmPassword,
      isLoading,
    } = this.state;
    if (isLoading) {
      return <Spinner />;
    }

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.keyboardAvoidingContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          innerRef={(ref) => {
            this.scroll = ref;
          }}
          keyboardShouldPersistTaps={'always'}
          enableOnAndroid={false}>
          <TouchableOpacity
            style={styles.backIconWrapper}
            activeOpacity={0.4}
            onPress={() => navigation.navigate('Home')}>
            <CustomIcon
              name={'left-arrow'}
              size={16}
              color={colors.darkBlack}
            />
          </TouchableOpacity>
          <View style={styles.innerContainer}>
            <Text style={styles.titleText}>Let’s Get Started</Text>
            <Text style={styles.subTitleText}>
              Create an account to continue!
            </Text>
            {errorText && <WrongInputWarning warningText={errorText} />}
            <RCTextInput
              inputRef={(e) => {
                this.nameInput = e;
              }}
              title={'User Name'}
              value={name}
              returnKeyType={'next'}
              iconLeft={'user'}
              onChangeText={(name) => this.setState({name})}
              onSubmitEditing={() => {
                this.mobileInput.focus();
              }}
            />
            <RCTextInput
              inputRef={(e) => {
                this.mobileInput = e;
              }}
              title={'Phone Number'}
              value={mobile}
              returnKeyType={'next'}
              iconLeft={'smartphone'}
              keyboardType={'phone-pad'}
              onChangeText={(mobile) => this.setState({mobile})}
              onSubmitEditing={() => {
                this.emailInput.focus();
              }}
            />
            <RCTextInput
              inputRef={(e) => {
                this.emailInput = e;
              }}
              title={'Email'}
              value={email}
              returnKeyType={'next'}
              iconLeft={'email'}
              keyboardType={'email-address'}
              onChangeText={(email) => this.setState({email})}
              onSubmitEditing={() => {
                this.passwordInput.focus();
              }}
            />
            <RCTextInput
              inputRef={(e) => {
                this.passwordInput = e;
              }}
              secureTextEntry={true}
              title={'Password'}
              value={password}
              returnKeyType={'next'}
              iconLeft={'padlock'}
              onChangeText={(password) => this.setState({password})}
              onSubmitEditing={() => {
                this.confirmPasswordInput.focus();
              }}
            />
            <RCTextInput
              inputRef={(e) => {
                this.confirmPasswordInput = e;
              }}
              secureTextEntry={true}
              title={'Confirm Password'}
              value={confirmPassword}
              returnKeyType={'go'}
              iconLeft={'padlock'}
              onChangeText={(confirmPassword) =>
                this.setState({confirmPassword})
              }
              onSubmitEditing={() => this.submit()}
            />
            <Button
              title={'sign up'}
              style={styles.buttonStyle}
              loading={this.state.saving}
              onPress={() => this.submit()}
            />
            <Text style={styles.msgText}>
              Already have an account?{' '}
              <Text style={styles.signupText} onPress={() => this.openLogin()}>
                Sign in
              </Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  loginSuccess: (data) => dispatch(loginSuccess(data)),
  getCart: () => dispatch(getCart()),
});

export default compose(
  connect(null, mapDispatchToProps),
  graphql(ADD_USER, {name: 'addUser'}),
)(SignUp);
