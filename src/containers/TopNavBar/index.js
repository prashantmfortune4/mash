import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import {colors} from '../../constants/colors';
import FastImage from 'react-native-fast-image';
import {images} from '../../../assets';
import {CustomIcon} from '../../utils/Icons';

const TopNavBar = React.memo(
  ({
    navigation,
    from,
    notificationCount,
    cartTotal,
    title,
    subTitle,
    IconLeft,
    onBackPress,
    buttonRight,
  }) => {
    if (from && from === 'home') {
      return (
        <View style={styles.headerWrapper}>
          <View style={styles.headerTopWrapper}>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={styles.iconWrapper}
                activeOpacity={0.4}
                onPress={() => navigation.openDrawer()}>
                <CustomIcon name={'bar'} size={18} color={colors.primary} />
              </TouchableOpacity>
              <FastImage
                source={images.logo}
                resizeMode={FastImage.resizeMode.contain}
                style={styles.logo}
              />
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={styles.iconWrapper}
                activeOpacity={0.4}
                onPress={() => navigation.navigate('Cart')}>
                <CustomIcon name={'basket'} size={19} color={colors.gray} />
                {cartTotal > 0 && (
                  <View
                    style={[
                      styles.badgeWrapper,
                      cartTotal > 99 && styles.badgeWrapperStyle,
                    ]}>
                    <Text style={styles.badgeText}>
                      {cartTotal > 99 ? '99+' : cartTotal}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconWrapper}
                activeOpacity={0.4}
                onPress={() => navigation.navigate('Notification')}>
                <CustomIcon
                  name={'notification-o'}
                  size={19}
                  color={colors.gray}
                />
                {notificationCount > 0 && (
                  <View
                    style={[
                      styles.badgeWrapper,
                      notificationCount > 99 && styles.badgeWrapperStyle,
                    ]}>
                    <Text style={styles.badgeText}>
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.searchWrapper}
            activeOpacity={1}
            onPress={() => navigation.navigate('Search')}>
            <Text style={styles.searchText}>
              Search For items, categories etc
            </Text>
            <CustomIcon name={'search'} size={20} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.headerWrapper}>
        <View style={styles.headerStyle}>
          <View style={styles.titleContainer}>
            <Text
              style={styles.titleText}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {title}{' '}
              {subTitle !== undefined && (
                <Text style={styles.subTitleText}>{subTitle}</Text>
              )}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.backIconWrapper}
            activeOpacity={0.4}
            onPress={() => (onBackPress ? onBackPress() : navigation.goBack())}>
            {IconLeft ? (
              <IconLeft />
            ) : (
              <CustomIcon name={'left-arrow'} size={16} color={colors.black} />
            )}
          </TouchableOpacity>
          {buttonRight && buttonRight()}
        </View>
      </View>
    );
  },
);

export default TopNavBar;
