import { useEffect, useState } from "react";
import { apiService } from "../../../api";
import { InviteLinkIcon } from "../../../components/Icons/InviteLinkIcon";
import s from "./Invite.module.scss";
import Btn from "../../../components/Btn/Btn";
import { UserRead } from "../../../types/user";

export const Invite = () => {
  const [referrals, setReferrals] = useState<UserRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserRead | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const referrals = (await apiService.getUserReferrals()).data;
        setReferrals(referrals);

        const userData = (await apiService.getUser()).data;
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  const handleInviteClick = () => {
    try {
      if (!window.Telegram?.WebApp) {
        console.error("Telegram WebApp is not available");
        return;
      }

      const captionText = "Share";
      const refLink = userData?.ref_link || "";

      window.Telegram.WebApp.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(
          refLink
        )}&text=${encodeURIComponent(captionText)}`
      );
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className={s.wrapper}>
      <div className={s.top}>
        <div className={s.invite_btn}>
          <Btn
            fontSize="20"
            padding="15px 18px"
            height="48"
            onClick={handleInviteClick}
          >
            <InviteLinkIcon /> INVITE FRIEND
          </Btn>
        </div>
        <div className={s.friends}>FRIENDS: {referrals.length}</div>
      </div>
      <div className={s.items}>
        {referrals.length > 0 ? (
          referrals.map((referral, index) => (
            <div className={s.item} key={index}>
              <div className={s.item_img}>
                <img src={"/friend.png"} alt={referral.first_name || ""} />
              </div>
              <div className={s.item_content}>{referral.first_name}</div>
            </div>
          ))
        ) : (
          <div className={s.no_referrals}>No referrals yet</div>
        )}
      </div>
    </div>
  );
};
