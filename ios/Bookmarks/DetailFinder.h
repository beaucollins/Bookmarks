//
//  DetailFinder.h
//  Bookmarks
//
//  Created by Beau Collins on 1/11/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <HTMLReader/HTMLReader.h>
#import "SiteDetailLoader.h"

typedef HTMLElement *(^MatcherBlock)(HTMLNode* node);
typedef NSString *(^ExtractorBlock)(HTMLElement *node);

@interface DetailFinder : NSObject <DetailExtractor>

@property(nonatomic, copy) MatcherBlock matcher;
@property(nonatomic, copy) ExtractorBlock exractor;

-(instancetype)initWithMatcher:(MatcherBlock )matcher andExtractor:(ExtractorBlock )extractor;



@end
