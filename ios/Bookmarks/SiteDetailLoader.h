//
//  SiteDetailLoader.h
//  Bookmarks
//
//  Created by Beau Collins on 1/11/16.
//  Copyright © 2016 Automattic. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"
#import <HTMLReader/HTMLReader.h>

@protocol DetailExtractor <NSObject>
- (id) extractDetailFromNode:(HTMLNode *)node;
@end

@interface SiteDetailLoader : NSObject <RCTBridgeModule>

@end
