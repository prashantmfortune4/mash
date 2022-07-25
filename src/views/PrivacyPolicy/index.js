import React from 'react';
import { View, ScrollView, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import apolloClient from '../../graphql/client';
import { GET_PRIVACY_POLICY } from '../../graphql/queries';
import styles from './styles';
import TopNavBar from '../../containers/TopNavBar';
import Spinner from '../../containers/Spinner';

class PrivacyPolicy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      webViewLoading: true,
      privacyPolicy: ''
    }
  };

  async componentDidMount() {
    try {
      const result = await apolloClient.query({
        query: GET_PRIVACY_POLICY,
        fetchPolicy: 'no-cache'
      })
      if(result && result.data && result.data.getPrivacyPolicy && result.data.getPrivacyPolicy.trim() !== '') this.setState({ privacyPolicy: result.data.getPrivacyPolicy.trim() })
    } catch (error) {
      console.log(error)
    }
    this.setState({ loading: false })
  }

  render() {
    const { loading, webViewLoading, privacyPolicy } = this.state

    return (
      <View style={styles.container}>
        <TopNavBar
          title={'Privacy Policy'}
          navigation={this.props.navigation}
        />
        <View style={styles.webViewWrapper}>
          <WebView
            source={{ html: `
              <head>
                <style>
                  body {
                    margin: 12px;
                  }
                  * {
                    font-family: 'Karla', sans-serif !important;
                    font-size: 14px;
                    color: #222222;
                    max-width: 100%;
                  }
                </style>
                <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
                <link href="https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,400;0,500;0,700;1,500;1,600&display=swap" rel="stylesheet">
              </head>
              ${privacyPolicy}
            ` }}
            style={styles.webView}
            onLoadStart={() => {
              this.setState({ webViewLoading: true });
            }}
            onLoadEnd={() => {
              this.setState({ webViewLoading: false });
            }}
            bounces={false}
            javaScriptEnabled
            domStorageEnabled
          />
          {(loading || webViewLoading) && <Spinner style={styles.spinnerStyle} />}
        </View>
      </View>
    );
  }
}

export default PrivacyPolicy;
