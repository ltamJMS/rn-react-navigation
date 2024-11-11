#import "AppDelegate.h"
#import "RNBootSplash.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <RNCallKeep/RNCallKeep.h>
#import <PushKit/PushKit.h>
#import "RNFBMessagingModule.h"
#import "RNVoipPushNotificationManager.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSLog(@"[DEBUG] 🎁🎁🎁🎁🎁🎁🎁🎁 Application did finish launching");  

  // Initialize Firebase  
    [FIRApp configure];  
    [RNCallKeep setup:@{
      @"appName": @"InfinitalkPhone",
      @"maximumCallGroups": @3,
      @"maximumCallsPerCallGroup": @1,
      @"supportsVideo": @NO,
    }];

  self.moduleName = @"rnCliApp";
  self.initialProps = @{};
    
  [RNVoipPushNotificationManager voipRegistration];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  NSLog(@"[DEBUG] 🎁🎁🎁🎁🎁🎁🎁🎁 Successfully registered for remote notifications"); 
  [FIRMessaging messaging].APNSToken = deviceToken;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void(^)(NSArray<id<UIUserActivityRestoring>> * __nullable restorableObjects))restorationHandler {
  return [RNCallKeep application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}

#pragma mark - PushKit

// updated push credentials
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(NSString *)type {
  NSLog(@"[DEBUG] 🎁🎁🎁🎁🎁🎁🎁🎁 Did update push credentials");  
  [RNVoipPushNotificationManager didUpdatePushCredentials:credentials forType:(NSString *)type];
}

// incoming pushes
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(NSString *)type {
  NSLog(@"[DEBUG] 🎁🎁🎁🎁🎁🎁🎁🎁 Did receive incoming push payload"); 
  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
}

- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)(void))completion {  
    NSLog(@"[DEBUG] 🎁🎁🎁🎁🎁🎁🎁🎁 Received incoming push with payload", payload); 
    NSString *uuid = [[[NSUUID UUID] UUIDString] lowercaseString];  
    NSString *callerName = @"InfinitalkPhone";  
    NSString *handle = @"Caller Handle";  

    [RNCallKeep reportNewIncomingCall:uuid  
                               handle:handle  
                           handleType:@"generic"  
                             hasVideo:NO  
                  localizedCallerName:callerName  
                      supportsHolding:YES  
                         supportsDTMF:YES  
                     supportsGrouping:YES  
                   supportsUngrouping:YES  
                          fromPushKit:YES  
                              payload:nil  
                withCompletionHandler:^{    
        NSLog(@"Reported new incoming call to CallKit");  
        completion(); // Finish the push processing  
    }];  
}

- (void)customizeRootView:(RCTRootView *)rootView {
  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView]; // ⬅️ initialize the splash screen
}

@end
