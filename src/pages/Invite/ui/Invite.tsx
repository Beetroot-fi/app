import Btn from "../../../components/Btn/Btn";
import { InviteLinkIcon } from "../../../components/Icons/InviteLinkIcon";
import s from "./Invite.module.scss";

export const Invite = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.top}>
        <div className={s.invite_btn}>
          <Btn fontSize="20" padding="15px 18px" height="48">
            <InviteLinkIcon /> INVITE FRIEND
          </Btn>
        </div>
        <div className={s.friends}>FRIENDS: 274</div>
      </div>
      <div className={s.items}>
        <div className={s.item}>
          <div className={s.item_img}>
            <img src="/friend.png" alt="" />
          </div>
          <div className={s.item_content}>pavel Durov</div>
        </div>
        <div className={s.item}>
          <div className={s.item_img}>
            <img src="/friend.png" alt="" />
          </div>
          <div className={s.item_content}>pavel Durov</div>
        </div>
        <div className={s.item}>
          <div className={s.item_img}>
            <img src="/friend.png" alt="" />
          </div>
          <div className={s.item_content}>pavel Durov</div>
        </div>
        <div className={s.item}>
          <div className={s.item_img}>
            <img src="/friend.png" alt="" />
          </div>
          <div className={s.item_content}>pavel Durov</div>
        </div>
        <div className={s.item}>
          <div className={s.item_img}>
            <img src="/friend.png" alt="" />
          </div>
          <div className={s.item_content}>pavel Durov</div>
        </div>
        <div className={s.item}>
          <div className={s.item_img}>
            <img src="/friend.png" alt="" />
          </div>
          <div className={s.item_content}>pavel Durov</div>
        </div>
        <div className={s.item}>
          <div className={s.item_img}>
            <img src="/friend.png" alt="" />
          </div>
          <div className={s.item_content}>pavel Durov</div>
        </div>
        <div className={s.item}>
          <div className={s.item_img}>
            <img src="/friend.png" alt="" />
          </div>
          <div className={s.item_content}>pavel Durov</div>
        </div>
        <div className={s.item}>
          <div className={s.item_img}>
            <img src="/friend.png" alt="" />
          </div>
          <div className={s.item_content}>pavel Durov</div>
        </div>
        <div className={s.item}>
          <div className={s.item_img}>
            <img src="/friend.png" alt="" />
          </div>
          <div className={s.item_content}>pavel Durov</div>
        </div>
        <div className={s.item}>
          <div className={s.item_img}>
            <img src="/friend.png" alt="" />
          </div>
          <div className={s.item_content}>pavel Durov</div>
        </div>
        <div className={s.item}>
          <div className={s.item_img}>
            <img src="/friend.png" alt="" />
          </div>
          <div className={s.item_content}>pavel Durov</div>
        </div>
        <div className={s.item}>
          <div className={s.item_img}>
            <img src="/friend.png" alt="" />
          </div>
          <div className={s.item_content}>pavel Durov</div>
        </div>
      </div>
    </div>
  );
};
