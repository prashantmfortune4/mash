import React from 'react';
import {View, Text, FlatList, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import styles from './styles';
import {colors} from '../../constants/colors';
import {images} from '../../../assets';
import TopNavBar from '../../containers/TopNavBar/index';

class OrderDetail extends React.Component {
  renderProduct = ({item, index}, total) => {
    const productImage =
      item.photos && item.photos.length > 0
        ? {uri: item.photos[0]}
        : images.placeholder;

    return (
      <View
        style={[
          styles.productWrapper,
          {
            paddingTop: index == 0 ? 0 : 16,
            paddingBottom: index + 1 == total ? 0 : 16,
            borderBottomWidth: index + 1 == total ? 0 : 1,
          },
        ]}>
        <View style={styles.imageWrapper}>
          <FastImage
            source={productImage}
            resizeMode={FastImage.resizeMode.contain}
            style={styles.productImage}
          />
        </View>
        <View style={styles.rightWrapper}>
          <Text
            style={styles.nameText}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {item.name}
          </Text>
          <View style={styles.optionsWrapper}>
            {item.options &&
              item.options.length > 0 &&
              item.options.map((option, index) => {
                return (
                  <React.Fragment key={index}>
                    <Text style={styles.optionTitleText}>
                      {option.name !== undefined && `${option.name}:`}{' '}
                      <Text style={styles.optionValueText}>
                        {option.value !== undefined && option.value}
                      </Text>
                    </Text>
                    {index + 1 !== item.options.length && (
                      <View style={styles.optionBorder}></View>
                    )}
                  </React.Fragment>
                );
              })}
          </View>
          <View style={styles.infoWrapper}>
            <Text style={styles.priceText}>&#x20B9;{item.price}</Text>
            <Text style={styles.optionTitleText}>
              Quantity: <Text style={styles.colorBlack}>{item.quantity}</Text>
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const order =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.order
        ? this.props.navigation.state.params.order
        : {};

    return (
      <View style={styles.container}>
        <TopNavBar navigation={this.props.navigation} title={'Order Details'} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          style={styles.scrollViewStyle}>
          {order && order.products && order.products.length > 0 && (
            <>
              <View style={styles.wrapper}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  data={order.products}
                  renderItem={(item) =>
                    this.renderProduct(item, order.products.length)
                  }
                  bounces={false}
                />
              </View>
              <View style={styles.summaryWrapper}>
                <View style={styles.row}>
                  <Text style={styles.textStyle}>{`Price (${
                    order.products.length
                  } ${order.products.length > 1 ? 'items' : 'item'})`}</Text>
                  <Text style={styles.textStyle}>&#x20B9;{order.subTotal}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.textStyle}>Delivery Charges</Text>
                  <Text style={styles.textStyle}>
                    &#x20B9;{order.deliveryCharge}
                  </Text>
                </View>
                <View style={[styles.row, styles.border]}>
                  <Text style={styles.payAmountText}>Total Amount Payable</Text>
                  <Text style={styles.payAmountText}>
                    &#x20B9;{order.totalPrice}
                  </Text>
                </View>
                {order.totalDiscount > 0 && (
                  <Text style={styles.discountText}>
                    You saved &#x20B9;{order.totalDiscount} on this order
                  </Text>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    );
  }
}

export default OrderDetail;
