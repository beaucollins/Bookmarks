//
//  DetailFinder.m
//  Bookmarks
//
//  Created by Beau Collins on 1/11/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "DetailFinder.h"

@implementation DetailFinder

-(instancetype)initWithMatcher:(MatcherBlock )matcher andExtractor:(ExtractorBlock) extractor {
  if (self = [super init]) {
    self.matcher = matcher;
    self.exractor = extractor;
    return self;
  }
  return nil;
}

- (id)extractDetailFromNode:(HTMLNode *)node {
  HTMLElement *found = self.matcher(node);
  if (found == nil) {
    return nil;
  }
  return self.exractor(found);
}

@end
