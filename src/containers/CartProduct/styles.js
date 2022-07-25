import {StyleSheet, Platform} from 'react-native';
import {colors} from '../../constants/colors';
import {windowWidth} from '../../utils/deviceInfo';

const qtyWrapper = {
  height: 34,
  width: 34,
  alignItems: 'center',
  justifyContent: 'center',
};

export default StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: 16,
    margin: 15,
  },
  productWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomColor: colors.paleGray,
  },
  imageWrapper: {
    height: windowWidth * 0.25,
    width: windowWidth * 0.25,
    backgroundColor: colors.paleGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  productImage: {
    height: windowWidth * 0.25,
    width: windowWidth * 0.25,
    borderRadius: 10,
  },
  rightWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 15,
    width: windowWidth - (windowWidth * 0.25 + 75),
  },
  nameText: {
    fontSize: 16,
    color: colors.darkBlack,
    fontFamily: 'Montserrat-Regular',
    textTransform: 'capitalize',
    lineHeight: 20,
  },
  nameTextWidth: {
    width: windowWidth - 172,
  },
  optionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: windowWidth - (windowWidth * 0.25 + 75),
    marginTop: 12,
  },
  optionTitleText: {
    fontSize: 14,
    color: colors.darkGray,
    fontFamily: 'Montserrat-Regular',
    textTransform: 'capitalize',
  },
  optionValueText: {
    fontSize: 14,
    color: colors.darkBlack,
    fontFamily: 'Montserrat-Regular',
    textTransform: 'none',
  },
  optionBorder: {
    marginHorizontal: 10,
    height: 15,
    width: 1,
    backgroundColor: colors.darkGray,
  },
  infoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  priceText: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: 'Montserrat-Bold',
  },
  oldPriceText: {
    fontSize: 14,
    color: colors.darkGray,
    fontFamily: 'Montserrat-Regular',
    textDecorationLine: 'line-through',
  },
  quantityWrapper: {
    flexDirection: 'row',
  },
  minusQuantityView: {
    ...qtyWrapper,
    borderRadius: 5,
    backgroundColor: colors.paleGray,
  },
  quantityView: {
    ...qtyWrapper,
    width: 38,
  },
  quantityText: {
    fontSize: 16,
    color: colors.darkBlack,
    fontFamily: 'Montserrat-SemiBold',
  },
  plusQuantityView: {
    ...qtyWrapper,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  comingSoonText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: 'Montserrat-SemiBold',
  },
  removeButtonWrapper: {
    height: '100%',
    marginRight: 16,
    justifyContent: 'center',
  },
  removeButton: {
    height: 40,
    width: 40,
    borderWidth: 2,
    borderColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  quantityTitleText: {
    fontSize: 14,
    color: colors.darkGray,
    fontFamily: 'Montserrat-Regular',
  },
  colorBlack: {
    color: colors.darkBlack,
  },
});
