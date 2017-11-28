export default {
  update: (
    utils,
    liveNodes, liveStart, liveEnd, liveLength,
    virtualNodes, virtualStart, virtualEnd /*, virtualLength */
  ) => {
    const { splicer } = utils;
    while (liveStart < liveEnd && virtualStart < virtualEnd) {
      const liveValue = liveNodes[liveStart];
      const virtualValue = virtualNodes[virtualStart];
      const status = liveValue === virtualValue ?
                      0 : (liveNodes.indexOf(virtualValue) < 0 ? 1 : -1);
      // nodes can be either removed ...
      if (status < 0) {
        splicer.splice(liveStart, 1);
        liveEnd--;
        liveLength--;
      }
      // ... appended ...
      else if (0 < status) {
        splicer.splice(liveStart, 0, virtualValue);
        liveStart++;
        liveEnd++;
        liveLength++;
        virtualStart++;
      }
      // ... or ignored, since it's the same ...
      else {
        liveStart++;
        virtualStart++;
      }
    }
    if (liveStart < liveEnd) {
      splicer.splice(liveStart, liveEnd - liveStart);
    }
    if (virtualStart < virtualEnd) {
      splicer.splice.apply(
        splicer,
        [liveEnd, 0].concat(
          virtualNodes.slice(virtualStart, virtualEnd)
        )
      );
    }
  }
};