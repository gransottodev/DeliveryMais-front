import md5 from 'md5';

const strSalt = 'j5*k.9S8W6*(/OG5#1O1Dfp5z9/3U5dls5y9s6hU49Z95FQyn7ab9r5j6k3';

function SaltPassword(pass){
    let str = '';    

    for (let i = 0; i < pass.length; i++) {
        str = str + strSalt.substring(i, i + 1) + pass.substring(i, i + 1);
    }

    return md5(md5(str));
}

export default SaltPassword;