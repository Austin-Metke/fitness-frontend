import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { createUser, getUserByGoogleId } from '@/db/user';

export default function() {
    GoogleSignin.configure({
        webClientId: "442605191795-15h3f17jnsr1tbp5sbhu80mpqdn98qq5.apps.googleusercontent.com",
        offlineAccess: false,
    });

    return (
        <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={async () => {
                try {
                    await GoogleSignin.hasPlayServices();
                    const userInfo = await GoogleSignin.signIn();
                    const user = userInfo.data?.user;
                    if(user) {
                        const dbUser = await getUserByGoogleId(user.id);
                    }
                    console.log(JSON.stringify(userInfo, null, 2));
                    console.log(user?.id);
                } catch(error: any) {
                    if(error.code === statusCodes.SIGN_IN_CANCELLED) {
                        console.log("err1")

                    } else if(error.code === statusCodes.IN_PROGRESS) {
                        console.log("err2")
                    } else if(error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                        console.log("err3")
                    } else {
                        console.log("err4")
                    }
                }
            }}
        />
    );
}
