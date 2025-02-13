import examStore from "./examStore";
import progressStore from "./progressStore";

/**
 * アプリケーションのストアをまとめたオブジェクト
 */
const rootStore = {
  examStore,
  progressStore,
};

/**
 * React Componentでストアを使用するためのコンテキスト作成用関数
 * @param {React.Component} Component - ラップするコンポーネント
 * @returns {Function} ストアをpropsとして注入するHOC
 */
export const withStores = (Component) => {
  return (props) => {
    return <Component {...props} stores={rootStore} />;
  };
};

export default rootStore;
