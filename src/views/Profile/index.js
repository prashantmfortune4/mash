import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import FastImage from 'react-native-fast-image';
import sharedStyles from '../../styles';
import styles from './styles';
import { colors } from '../../constants/colors';
import { connect } from 'react-redux';
import { GET_USER_DETAILS } from '../../graphql/queries';
import apolloClient from '../../graphql/client';
import { loginSuccess } from '../../actions/login';
import { getCart } from '../../actions/cart';
import Spinner from '../../containers/Spinner';
import TopNavBar from '../../containers/TopNavBar/index';
import Alert from '../../containers/Alert';
import { images } from '../../../assets';
import { setData, getData, deleteData } from '../../utils/storage';
import { CustomIcon } from '../../utils/Icons';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: {},
      isConfirmationModal: false
    }
    this.focusListener = this.props.navigation.addListener('willFocus', async () => {
      this.setState({ loading: true })
      const token = JSON.parse(await getData('token'))
      if(token) await this.getUserDetails()
      else this.props.navigation.navigate('SignUp')
    })
  }

  componentWillUnmount() {
    this.focusListener.remove()
  }

  getUserDetails = async () => {
    try {
      const result = await apolloClient.query({
        query: GET_USER_DETAILS,
        fetchPolicy: 'no-cache'
      })
      if(result && result.data && result.data.getUserDetails && result.data.getUserDetails.profile) {
        let user = {}
        if(result.data.getUserDetails.email) user['email'] = result.data.getUserDetails.email
        if(result.data.getUserDetails.profile.name) user['name'] = result.data.getUserDetails.profile.name
        if(result.data.getUserDetails.profile.mobile) user['mobile'] = result.data.getUserDetails.profile.mobile
        if(result.data.getUserDetails.profile.photo) user['photo'] = result.data.getUserDetails.profile.photo
        this.setState({ user })
      }
    } catch (error) {
      console.log(error)
    }
    this.setState({ loading: false })
  }

  renderOption = (itemName, iconName, onPress) => (
    <TouchableOpacity style={styles.optionWrapper} activeOpacity={0.8} onPress={onPress}>
      <CustomIcon name={iconName} size={20} color={colors.darkBlack} />
      <View style={styles.optionTextWrapper}>
        <Text style={styles.optionText}>{itemName}</Text>
      </View>
    </TouchableOpacity>
  )

  openConfirmationModal = () => {
    this.setState({ isConfirmationModal: true })
  }

  closeConfirmationModal = () => {
    this.setState({ isConfirmationModal: false })
  }

  handleLogout = async () => {
    this.setState({ isConfirmationModal: false })
    await deleteData('token')
    await this.props.loginSuccess({ token: null })
    await this.props.getCart()
    this.props.navigation.navigate('Home')
  }

  render() {
    const { navigation } = this.props
    const { loading, user, isConfirmationModal } = this.state

    return (
      <View style={sharedStyles.container}>
        <TopNavBar onBackPress={() => navigation.navigate('Home')} navigation={navigation} title={'My Account'} />
        { loading ?
          <Spinner style={styles.spinnerStyle} />
        :
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={styles.scrollView}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles.infoWrapper}>
              <View style={styles.imageOuterWrapper}>
                <View style={styles.imageInnerWrapper}>
                  {user.photo !== undefined ?
                    <FastImage source={{ uri: user.photo }} style={styles.profileImage} resizeMode={FastImage.resizeMode.stretch} />
                  :
                    <FastImage source={images.user} style={styles.profileIcon} resizeMode={FastImage.resizeMode.contain} />
                  }
                </View>
              </View>
              <View style={styles.rightWrapper}>
                <Text style={styles.nameText}>{user.name}</Text>
                <Text style={styles.textStyle}>{user.email}</Text>
                <Text style={styles.textStyle}>{user.mobile}</Text>
              </View>
              <TouchableOpacity
                style={styles.editIconWrapper}
                activeOpacity={0.6}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <CustomIcon name={'pencil'} size={19} color={colors.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.optionsOuterWrapper}>
              <View style={styles.optionsInnerWrapper}>
                {this.renderOption('My Orders', 'sent', () => navigation.navigate('Order'))}
                {this.renderOption('My Address', 'address', () => navigation.navigate('Addressess'))}
                {this.renderOption('Notifications', 'bell', () => navigation.navigate('Notification'))}
                {this.renderOption('Log Out', 'logout', () => this.openConfirmationModal())}
              </View>
            </View>
          </ScrollView>
        }
        {isConfirmationModal &&
          <Alert
            isVisible={isConfirmationModal}
            message={'Are you sure you want to logout of this app?'}
            cancelText={'No'}
            confirmText={'Yes'}
            onConfirm={() => this.handleLogout()}
            onClosed={() => this.closeConfirmationModal()}
          />
        }
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loginSuccess: async (data) => dispatch(loginSuccess(data)),
  getCart: () => dispatch(getCart())
});

export default connect(null, mapDispatchToProps)(Profile);
