// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import {
    Text,
    View,
    StyleSheet,
    Image,
} from 'react-native';
import fb from 'react-native-firebase';
import Button from 'apsl-react-native-button';
import SplashScreen from 'react-native-splash-screen';
import Swiper from 'react-native-swiper';
import { NavigationActions } from 'react-navigation';
import type { NavigationProp } from '../flow-types';
import { completeWelcome } from '../actions/index';
import {
    COLOR_DEEP_BLUE,
    COLOR_LIGHT_GRAY,
    COLOR_RED,
} from '../constants';

const GLOBAL = require('../Globals');

const styles = StyleSheet.create({
    startButton: {
        alignSelf: 'center',
        backgroundColor: COLOR_RED,
        width: GLOBAL.SCREEN_WIDTH * 0.90,
        height: 50,
        padding: 12,
        borderRadius: 5,
        borderWidth: 0.1,
        marginTop: 50,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_LIGHT_GRAY,
        flexDirection: 'column',
    },
    heading: {
        color: COLOR_DEEP_BLUE,
        marginBottom: 30,
        textAlign: 'center',
        fontSize: 36,
        fontWeight: 'bold',
        width: GLOBAL.SCREEN_WIDTH * 0.75,
    },
    text: {
        color: COLOR_DEEP_BLUE,
        width: GLOBAL.SCREEN_WIDTH * 0.8,
        textAlign: 'center',
        fontSize: 18,

    },
    welcomeIcon: {
        marginBottom: 30,
        resizeMode: 'contain',
        height: GLOBAL.SCREEN_HEIGHT * 0.3,
        maxWidth: GLOBAL.SCREEN_WIDTH * 0.8,
    },
});

type Props = {
    navigation: NavigationProp,
    onWelcomeComplete: (any) => any,
    welcomeCompleted: boolean,
};

class _WelcomeScreen extends React.Component<Props> {
    componentDidMount() {
        const { welcomeCompleted } = this.props;
        if (welcomeCompleted) {
            this.finishWelcomeScreens();
        } else {
            SplashScreen.hide();
        }
    }

    componentDidUpdate() {
        const { welcomeCompleted } = this.props;
        if (welcomeCompleted === undefined) {
            SplashScreen.hide();
        }
    }

    finishWelcomeScreens = () => {
        const { navigation, onWelcomeComplete } = this.props;
        // remember that we saw the welcome screens (in redux state)
        onWelcomeComplete();
        navigation.reset([NavigationActions.navigate({ routeName: 'Login' })], 0);
    }

    handleButtonPress = () => {
        fb.analytics().logEvent('complete_onboarding');
        this.finishWelcomeScreens();
    }

    render() {
        const { welcomeCompleted } = this.props;
        return (welcomeCompleted
            ? <View style={{ flex: 1 }}><Text /></View>
            : <WelcomeCardView onCompletion={this.handleButtonPress} />
        );
    }
}

const mapStateToProps = (state, ownProps) => (
    {
        navigation: ownProps.navigation,
        welcomeCompleted: state.ui.user.welcomeCompleted,
    }
);

const mapDispatchToProps = dispatch => (
    {
        onWelcomeComplete: () => {
            dispatch(completeWelcome());
        },
    }
);

// WelcomeScreen
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(_WelcomeScreen);

type WelcomeCardProps = {
    onCompletion: any => any,
};

type WelcomeCardState = {
    newIndex: number,
};

// eslint-disable-next-line react/no-multi-comp
class WelcomeCardView extends React.Component<WelcomeCardProps, WelcomeCardState> {
    swiper: ?Swiper;

    /* eslint-disable global-require */
    render() {
        const { onCompletion } = this.props;
        fb.analytics().logEvent('starting_onboarding');
        return (
            <Swiper
                activeDotColor={COLOR_DEEP_BLUE}
                showsButtons={false}
                loop={false}
                ref={(r) => { this.swiper = r; }}
            >
                <View style={styles.slide}>
                    <Image style={styles.welcomeIcon} source={require('./assets/welcome1.png')} />
                    <Text style={styles.heading}>
                        Welcome to MapSwipe
                    </Text>
                    <Text style={styles.text}>
                        Help improve humanitarian responses from the comfort of your phone
                    </Text>
                </View>

                <View style={styles.slide}>
                    <Image style={styles.welcomeIcon} source={require('./assets/welcome2.png')} />
                    <Text style={styles.heading}>
                        Part of Missing Maps
                    </Text>
                    <Text style={styles.text}>
                        With Missing Maps, we aim to put the world&apos;s
                        vulnerable communities on the map
                    </Text>
                </View>

                <View style={styles.slide}>
                    <Image style={styles.welcomeIcon} source={require('./assets/welcome3.png')} />
                    <Text style={styles.heading}>
                        Swipe
                    </Text>
                    <Text style={styles.text}>
                        Complete tasks by swiping through satellite imagery
                        of areas that need mapping
                    </Text>
                </View>

                <View style={styles.slide}>
                    <Image style={styles.welcomeIcon} source={require('./assets/welcome4.png')} />
                    <Text style={styles.heading}>
                        Create meaningful data
                    </Text>
                    <Text style={styles.text}>
                        The data is used to focus the efforts of Missing Maps volunteers
                        to add detail to OpenStreetMap
                    </Text>
                </View>

                <View style={styles.slide}>
                    <Image style={styles.welcomeIcon} source={require('./assets/welcome5.png')} />
                    <Text style={styles.heading}>
                        Save lives
                    </Text>
                    <Text style={styles.text}>
                        The map helps organisations coordinate humanitarian
                        efforts and save lives
                    </Text>
                    <Button
                        style={styles.startButton}
                        onPress={() => onCompletion()}
                        textStyle={{ fontSize: 18, color: COLOR_LIGHT_GRAY, fontWeight: '700' }}
                    >
                    Sign Up
                    </Button>
                </View>
            </Swiper>
        );
    }
    /* eslint-enable global-require */
}
